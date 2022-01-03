import "./create-account.styles.scss";
import { useState } from "react";
import hash from "object-hash";
import ToggleButtonsMultiple from "../toggleButtonsMultiple/ToggleButtonsMultiple.component";
import Password from "../../modules/Password";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useDispatch } from "react-redux";
import { accountChangedRenderAction } from "../../store/actions/actions";

export default function CreateAccount({ closeCreateAccount, setIsLoading}) {
  const dispatch = useDispatch();
  const [output, setOutput] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountSubname, setAccountSubname] = useState("");
  const [passLength, setPassLength] = useState(12);
  const [passStartsWith, setPassStartsWith] = useState("");
  const [passEndsWith, setPassEndsWith] = useState("");
  const [passMustContain, setPassMustContain] = useState("");
  const [passAvoidChars, setPassAvoidChars] = useState("");
  const [passPattern, setPassPattern] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isValidAccount, setIsValidAccount] = useState(false);
  const [isChecked, setIsChecked] = useState({
    isDigitsChecked: true,
    isUppercaseChecked: true,
    isLowercaseChecked: true,
    isSymbolsChecked: true,
  });

  const createAccount = async () => {
    try {
      setIsLoading(true);
      closeCreateAccount();
      if (isValidAccount) {
        const newAccount = {
          accountName,
          accountSubname,
          passAvoidChars,
          passEndsWith,
          passLength,
          passMustContain,
          passPattern,
          passStartsWith,
          publicKey,
          isPassHasDigit: isChecked.isDigitsChecked,
          isPassHasUppercase: isChecked.isUppercaseChecked,
          isPassHasLowercase: isChecked.isLowercaseChecked,
          isPassHasSymbol: isChecked.isSymbolsChecked,
        };
        await addDoc(collection(db, "accounts"), newAccount);
        dispatch(accountChangedRenderAction());
        resetCreateAccountForm();
      }
    } catch (err) {
      console.log(err.massage);
    }
  };

  const resetCreateAccountForm = () => {
    setOutput("");
    setAccountName("");
    setAccountSubname("");
    setPassLength(12);
    setPassStartsWith("");
    setPassEndsWith("");
    setPassMustContain("");
    setPassAvoidChars("");
    setPassPattern("");
    setPrivateKey("");
    setPublicKey("");
    setIsValidAccount(false);
    setIsChecked({
      isDigitsChecked: true,
      isUppercaseChecked: true,
      isLowercaseChecked: true,
      isSymbolsChecked: true,
    });
  };

  const outputPassword = () => {
    if (accountName.length > 0) {
      if (privateKey.length > 0) {
        if (
          isChecked.isDigitsChecked ||
          isChecked.isUppercaseChecked ||
          isChecked.isLowercaseChecked ||
          isChecked.isSymbolsChecked
        ) {
          if (parseInt(passLength) > 0 && parseInt(passLength) < 41) {
            setIsValidAccount(true);
            const hashedPublicKey = hash(Math.random());
            setPublicKey(hashedPublicKey);
            const password = new Password(privateKey, hashedPublicKey);
            password.setKeyboard({
              avoidChars: passAvoidChars,
              isIncludeDigits: isChecked.isDigitsChecked,
              isIncludeUpperCase: isChecked.isUppercaseChecked,
              isIncludeLowerCase: isChecked.isLowercaseChecked,
              isIncludeSymbols: isChecked.isSymbolsChecked,
              mustIncludeChars: passMustContain,
            });

            if (passPattern.length > 0) {
              password.generateFromPattern(passPattern);
              setOutput(password.getPassword);
            } else {
              password.generate(passLength, passStartsWith, passEndsWith);
              setOutput(password.getPassword);
            }
          } else {
            setOutput("Password Length: Between 1 To 40");
            setIsValidAccount(false);
          }
        } else {
          setOutput("Missing Characters In Keyboard");
          setIsValidAccount(false);
        }
      } else {
        setOutput("Missing: Private Key");
        setIsValidAccount(false);
      }
    } else {
      setOutput("Missing: Account Name");
      setIsValidAccount(false);
    }
  };

  const setCheckbox = (checkboxElement, statePropertyName) => {
    const cloneIsChecked = { ...isChecked };
    cloneIsChecked[statePropertyName] = checkboxElement.checked;
    setIsChecked(cloneIsChecked);
  };

  return (
    <div className="CreateAccount">
      <form className="create-account-form">
        <div className="create-account-details">
          <fieldset className="account-details">
            <legend>Account Settings</legend>
            <div>
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setAccountName(e.target.value);
                }}
                value={accountName}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Subname"
                onChange={(e) => {
                  setAccountSubname(e.target.value);
                }}
                value={accountSubname}
              />
            </div>
          </fieldset>
          <fieldset className="password-details">
            <legend>Password Settings</legend>
            <div>
              <ToggleButtonsMultiple
                setCheckbox={setCheckbox}
                isChecked={isChecked}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Password Length"
                min="1"
                max="40"
                onChange={(e) => {
                  setPassLength(e.target.value);
                }}
                value={passLength}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Starts With"
                onChange={(e) => {
                  setPassStartsWith(e.target.value);
                }}
                value={passStartsWith}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Ends With"
                onChange={(e) => {
                  setPassEndsWith(e.target.value);
                }}
                value={passEndsWith}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Must Contain"
                onChange={(e) => {
                  setPassMustContain(e.target.value);
                }}
                value={passMustContain}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Avoid Characters"
                onChange={(e) => {
                  setPassAvoidChars(e.target.value);
                }}
                value={passAvoidChars}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Pattern"
                onChange={(e) => {
                  setPassPattern(e.target.value);
                }}
                value={passPattern}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Private Key"
                onChange={(e) => {
                  setPrivateKey(e.target.value);
                }}
                value={privateKey}
              />
            </div>
            <button
              className="generate-button"
              type="button"
              onClick={outputPassword}
            >
              Generate
            </button>
          </fieldset>
        </div>
        <div>
          <input
            className="output"
            type="text"
            placeholder="Output"
            value={output}
            readOnly
          />
        </div>
        <button
          className="submit-button"
          type="button"
          onClick={createAccount}
          disabled={!isValidAccount}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
