import { useContext, useEffect } from "react";
import { SelectedTab } from "../../contexts/SelectedTab";
import "./InformationStyle.scss";

export default function Information3() {
    const { setSelectedTab } = useContext(SelectedTab);
    
    useEffect(() => {
      //setSelectedTab(2);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
          <h1>About Page</h1>
          <p>Learn more about us here.</p>
        </div>
    );
}