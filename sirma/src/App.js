import React, { useState, useEffect} from "react";
import Homepage from "./components/Homepage";
import './styles/global.scss';

const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
            <div>
              <Homepage />
            </div>
          )
        }
    </>
  );
};

export default App;