import React from "react";
import "../test.scss";   

export default function UploadProjectTest() {
    const Listing = React.forwardRef((props, ref) => {
        return <ul id="listing" ref={ref}></ul> 
    });

    const Dropzone = React.forwardRef((props, ref) => {
        return <div ref={ref} className="dropzone"></div> 
    });

    function scanFiles(item, container) {
        let elem = document.createElement("li");
        elem.textContent = item.name;
        container.appendChild(elem);

        if (item.isDirectory) {
            let directoryReader = item.createReader();
            let directoryContainer = document.createElement("ul");
            container.appendChild(directoryContainer);
            directoryReader.readEntries(function(entries) {
                entries.forEach(function(entry) {
                    scanFiles(entry, directoryContainer);
                });
            });
        }
    }

    Dropzone.addEventListener("dragover", function(event) {
        event.preventDefault();
    }, false);

    Dropzone.addEventListener("drop", function(event) {
        let items = event.dataTransfer.items;
      
        event.preventDefault();
        Listing.textContent = "";
      
        for (let i=0; i<items.length; i++) {
          let item = items[i].webkitGetAsEntry();
      
          if (item) {
              scanFiles(item, Listing);
          }
        }
      }, false);

    const dropzone = React.useRef(null);
    const listing = React.useRef(null);

    return ( 
        <div>
            <p>Drag files and/or directories to the box below!</p>

            <Dropzone ref={dropzone} />
                <div className="boxtitle">
                    Drop Files Here
                </div>

            <h2>Directory tree:</h2>

            <Listing ref={listing} />
            
        </div>
    );
}