import { useEffect, useState, useContext, createContext } from "react";
import { MsgSetAutoRestake } from "secretjs";
import { sleep, faucetURL, faucetAddress } from "shared/utils/commons";
import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faArrowRightArrowLeft,
  faRightLeft,
  faInfoCircle,
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Select from "react-select";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import { Helmet } from "react-helmet-async";
import { websiteName } from "App";
import {
  getKeplrViewingKey,
  SecretjsContext,
  setKeplrViewingKey,
} from "shared/context/SecretjsContext";

export const WrapContext = createContext(null);

export function Restake() {
  const queryParams = new URLSearchParams(window.location.search);

  const { secretjs, secretAddress, connectWallet } =
    useContext(SecretjsContext);

  // UI
  const [isValidAmount, setisValidAmount] = useState<boolean>(false);

  const [validators, setValidators] = useState<any>();
  const [validatorsForDelegator, setValidatorsForDelegator] = useState<any>();
  const [selectedValidator, setSelectedValidator] = useState<any>();

  useEffect(() => {
    if (!secretjs || !secretAddress) return;
    const fetchData = async () => {
      const { validators } = await secretjs.query.staking.validators({
        status: "BOND_STATUS_BONDED",
      });
      console.log(validators);
      console.log(
        validators
          ?.sort((a: any, b: any) =>
            a?.description.moniker.localeCompare(b?.description.moniker)
          )
          .map((item: any) => {
            return {
              label: item.description.moniker,
              value: item.description.moniker,
            };
          })
      );
      setValidators(validators);
      const validatorsForDelegator =
        await secretjs.query.distribution.delegatorValidators({
          delegator_address: secretAddress,
        });
      setValidatorsForDelegator(validatorsForDelegator);
    };
    fetchData();
  }, [secretAddress, secretjs]);

  useEffect(() => {
    if (!secretjs || !secretAddress) return;
    console.log(selectedValidator);
  }, [selectedValidator]);

  function SubmitButton(props: { disabled: boolean; enableRestake: boolean }) {
    const disabled = props.disabled;
    const enableRestake = props.enableRestake;

    async function submit() {
      if (!secretjs || !secretAddress) return;

      try {
        const toastId = toast.loading(
          `Changing restaking for validator ${selectedValidator.name}`,
          { closeButton: true }
        );
        await secretjs.tx
          .broadcast(
            [
              new MsgSetAutoRestake({
                delegator_address: secretAddress,
                validator_address: selectedValidator.value,
                enabled: checked,
              } as any),
            ],
            {
              gasLimit: 150_000,
              gasPriceInFeeDenom: 0.25,
              feeDenom: "uscrt",
            }
          )
          .catch((error: any) => {
            console.error(error);
            if (error?.tx?.rawLog) {
              toast.update(toastId, {
                render: `Changing restaking failed: ${error.tx.rawLog}`,
                type: "error",
                isLoading: false,
                closeOnClick: true,
              });
            } else {
              toast.update(toastId, {
                render: `Changing restaking failed: ${error.message}`,
                type: "error",
                isLoading: false,
                closeOnClick: true,
              });
            }
          })
          .then((tx: any) => {
            console.log(tx);
            if (tx) {
              if (tx.code === 0) {
                toast.update(toastId, {
                  render: `Changing restaking successfully`,
                  type: "success",
                  isLoading: false,
                  closeOnClick: true,
                });
              } else {
                toast.update(toastId, {
                  render: `Changing restaking failed: ${tx.rawLog}`,
                  type: "error",
                  isLoading: false,
                  closeOnClick: true,
                });
              }
            }
          });
      } finally {
      }
    }

    return (
      <>
        <div className="flex items-center">
          <button
            className={
              "enabled:bg-gradient-to-r enabled:from-cyan-600 enabled:to-purple-600 enabled:hover:from-cyan-500 enabled:hover:to-purple-500 transition-colors text-white font-semibold py-2.5 w-full rounded-lg disabled:bg-neutral-500"
            }
            disabled={disabled}
            onClick={() => submit()}
          >
            {secretAddress && secretjs && checked === true && (
              <>{`Enable Auto-restake`}</>
            )}
            {secretAddress && secretjs && checked === false && (
              <>{`Disable Auto-restake`}</>
            )}
          </button>
        </div>
      </>
    );
  }

  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleClick = () => {
    if (!secretAddress || !secretjs) {
      connectWallet();
    }
  };

  return (
    <>
      <Helmet>
        <title>Secret auto-restake</title>
      </Helmet>

      <div className="w-full max-w-xl mx-auto px-4 onEnter_fadeInDown relative">
        {!secretjs && !secretAddress ? (
          // Overlay to connect on click
          <div
            className="absolute block top-0 left-0 right-0 bottom-0 z-10"
            onClick={handleClick}
          ></div>
        ) : null}
        {/* Content */}
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8 w-full text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900">
          {/* Header */}
          <div className="flex items-center mb-4">
            <h1 className="inline text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
              Auto-Restake enabler
            </h1>
          </div>

          {/* *** From *** */}
          <div className="bg-neutral-200 dark:bg-neutral-800 p-4 rounded-xl">
            {/* Title Bar */}
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 font-semibold mb-2 text-center sm:text-left">
                Your Validators
              </div>
            </div>

            {/* Input Field */}
            <div className="w-full" id="fromInputWrapper">
              <Select
                isDisabled={!secretAddress}
                options={validatorsForDelegator?.validators.map((item: any) => {
                  return {
                    name: validators.find(
                      (validator: any) => validator.operator_address == item
                    ).description.moniker,
                    value: item,
                  };
                })}
                value={selectedValidator}
                onChange={setSelectedValidator}
                isSearchable={false}
                formatOptionLabel={(validator) => (
                  <div className="flex items-center">
                    <span className="font-semibold text-base">
                      {validator.name}
                    </span>
                  </div>
                )}
                className="react-select-wrap-container"
                classNamePrefix="react-select-wrap"
              />
            </div>
            <div className="flex mt-4">
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleChange}
                />
                Auto-restake
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <SubmitButton
            disabled={!secretjs || !secretAddress}
            enableRestake={true}
          />
        </div>
      </div>
    </>
  );
}
