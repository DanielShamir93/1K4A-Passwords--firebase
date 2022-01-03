import { withRouter } from "react-router-dom";
import { FcPlus } from "react-icons/fc";
import { HiMinusCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import CreateAccount from "../../components/createAccount/CreateAccount.component";
import { db } from "../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Account from "../../components/account/Account.component";
import "./home.styles.scss";
import { useSelector } from "react-redux";
import Spinner from "../../components/spinner/Spinner.component";

const Home = () => {
  const [accounts, setAccounts] = useState([]);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const statesObject = useSelector((state) => {
    return {accountChangedRender: state.accountChangedRender}
  })

  useEffect(() => {
    const getAccounts = async () => {
      try {
        setIsLoading(true);
        const { docs } = await getDocs(collection(db, "accounts"))
        setAccounts(docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setIsLoading(false);
        console.log('Home useEffect');
      } catch (err) {
        console.log(err.message);
      };
    };
    getAccounts();
  }, [statesObject.accountChangedRender]);

  const closeCreateAccount = () => {
    setIsCreateAccountOpen(false);
  }

  const renderAccounts = () => {
    return accounts.map((account) => {
      return (
        <Account key={account.id} account={account} setIsLoading={setIsLoading} />
      );
    });
  };

  return (
    <div className="Home">
      <div className="home-layout">
        <div className="toolbar">
          {!isLoading && <div>
              {isCreateAccountOpen ? (
                <HiMinusCircle
                  style={{color: "#9e2c2c"}}
                  className="create-account-icon"
                  onClick={() => {
                    setIsCreateAccountOpen(!isCreateAccountOpen);
                  }}
                />
              ) : (
                <FcPlus
                  className="create-account-icon"
                  onClick={() => {
                    setIsCreateAccountOpen(!isCreateAccountOpen);
                  }}
                />
              )}
            </div>}
        </div>
        <div className="accounts-gallery">{renderAccounts()}</div>
      </div>
      {isCreateAccountOpen && (
        <CreateAccount closeCreateAccount={closeCreateAccount} isLoading={isLoading} setIsLoading={setIsLoading} />
      )}
      {isLoading && <Spinner />}
    </div>
  );
};

export default withRouter(Home);
