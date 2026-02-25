import React from "react";
import NavBar from "./layouts/NavBar";
import SelectedTabProvider from "./contexts/SelectedTab";
import SelectedLangProvider from "./contexts/SelectedLang";
import SelectedPrimitiveProvider from "./contexts/SelectedPrimitive";
import SelectedFilesProvider from "./contexts/SelectedFiles";
import UploadedFilesProvider from "./contexts/UploadedFiles";
import LoginContextProvider from "./contexts/LoginContext";

export default function Controller() {
  return (
      <React.StrictMode>
        <SelectedTabProvider>
          <LoginContextProvider>
            <SelectedLangProvider> 
              <SelectedPrimitiveProvider> 
                <SelectedFilesProvider> 
                  <UploadedFilesProvider>

                    <NavBar />

                  </UploadedFilesProvider>
                </SelectedFilesProvider> 
              </SelectedPrimitiveProvider>
            </SelectedLangProvider>
          </LoginContextProvider>
        </SelectedTabProvider>
      </React.StrictMode>
  );
}