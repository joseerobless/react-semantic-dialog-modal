# React Semantic Dialog Modal

A flexible and customizable React component for creating accessible and semantic dialog modals. It offers options for customizing animations, close behaviors, and content, providing a user-friendly experience.

## Installation

React Semantic Dialog Modal is available as an [npm package](https://www.npmjs.com/package/react-semantic-dialog-modal).
```sh
npm install react-semantic-dialog-modal
```

All styles written in CSS and are in Modal.css

## Demo

https://joseerobless.github.io/

## Usage

```javascript
import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Modal } from "react-semantic-dialog-modal";
import "./path/to/your/override.css"; // To override default styles

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  const App = () => {
    const [showModal, setShowModal] = useState(false);

    const handleModalOpen = () => {
      console.log("Modal opened!");
    };

    const handleModalClose = () => {
      console.log("Modal closed!");
      setShowModal(false);
    };

    return (
      <>
        <button onClick={() => setShowModal(!showModal)}>
          {showModal ? "Hide Modal" : "Show Modal"}
        </button>
        <Modal
          header={<h2>Welcome to my modal</h2>}
          onOpen={handleModalOpen}
          onClose={handleModalClose}
          closeButtonText="Close"
          showCloseButton
          showCloseIcon={false}
          closeOnEscape
          animationOptions={{
            direction: "left",
            speed: "1000ms",
            closeDirections: {
              left: "modalSlideOutBottom",
            },
          }}
          enableAnimation={true}
          open={showModal}
        >
          {(onClose) => (
            <div style={{ display: "flex" }}>
              <p onClick={onClose}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          )}
        </Modal>
      </>
    );
  };

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

```

## API

#### props.className

 - `String`
 - default: `undefined`
 - A custom className added to the dialog element (can be leveraged for additional specificity for overriding styles).

#### props.onOpen

 - `() => void`
 - default: `undefined`
 - A callback function that is called when the dialog modal opens.

#### props.onClose

 - `() => void`
 - default: `undefined`
 - A callback function that is called when the dialog modal closes.

#### props.showCloseButton

 - `Boolean`
 - Default: `false`
 - If true, shows a button below the footer, with default styles defined in Modal.css.

#### props.showCloseIcon

 - `Boolean`
 - default: `true`
 - If true, shows a close icon in the top-right corner of the modal.

#### props.closeOnEscape

 - `Boolean`
 - default: `true`
 - If true, closes the dialog modal when the escape key is pressed.

#### props.closeButtonText

 - `String`
 - default: `Close`
 - The text of the close button.

#### props.enableAnimation

 - `Boolean`
 - default: `true`
 - Whether the animations defined by the animationOptions prop will be enabled.

#### props.animationOptions

 - `AnimationOptions` (See Modal.d.ts)
 - default: `{
    direction: "bottom",
    speed: "600ms",
    closeDirections: {}, // Allows you to map a custom closing direction, from the open direction defined above
  }`
 - Animation options for the modal.

#### props.header

 - `ReactNode`
 - default: `undefined`
 - A header element that will render above the children.

#### props.children

 - `ReactNode | ((closeModal: () => void, openModal: () => void, dialogRef: React.RefObject<HTMLDialogElement>) => ReactNode)`
 - default: `undefined`
 - Allows you to pass a ReactNode or a function that uses closeModal, openModal, and dialogRef passed from the component to allow for custom content that can interact directly with the modal (see Usage example).

#### props.footer

 - `ReactNode`
 - default: `undefined`
 - Allows you to render an optional element below the children.

 #### props.defaultIcon

 - `ReactNode`
 - default: ```js
    <svg
      fill="#000000"
      width="20px"
      height="20px"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z" />
    </svg>
    ```
 - Allows you to customize the default close icon for the dialog modal.

 #### props.fullscreen

 - `Boolean`
 - default: `false`
 - Allows you to update the dialog modal to be fullscreen.

  #### props.open

 - `Boolean`
 - default: `true`
 - Allows you to toggle the dialog modal open and closed.


## License

MIT