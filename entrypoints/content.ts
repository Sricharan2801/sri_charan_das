import aiIcon from '../assets/aiIcon.svg';
import insertIcon from '../assets/insertIcon.svg';
import generateIcon from "../assets/generateIcon.svg";
import regenerateIcon from "../assets/regenerateIcon.svg"

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"], // Matches LinkedIn URLs
  main() {
    // HTML structure for the custom dialog to be inserted into the page
    const dialogHtml = `
      <div id="custom-dialog" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 4000;">
        <div id="dialog-content" style="background: white; border-radius: 8px; width: 100%; max-width: 570px; padding: 20px;">
          <div id="chat-messages" style="margin-top: 10px; max-height: 200px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column;"></div>
          <div style="margin-bottom: 10px;">
            <input id="prompt-input" type="text" placeholder="Your prompt" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"/>
          </div>
          <div style="text-align: right; margin-top: 12px;">
            <button id="btn-insert" style="background: #fff; color: #666D80; padding: 8px 16px; border: 2px solid #666D80; border-radius: 4px; cursor: pointer; display: none; margin-right: 10px;">
              <img src="${insertIcon}" alt="Insert" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px;"> 
              <b>Insert</b>
            </button>
            <button id="btn-generate" style="background: #007bff; color: white; padding: 8px 16px; border: 2px solid #007bff; border-radius: 4px; cursor: pointer;">
              <img src="${generateIcon}" alt="Generate" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px"> 
              <b>Generate</b>
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert the dialog HTML into the document body
    document.body.insertAdjacentHTML("beforeend", dialogHtml);

    // Cache dialog elements for future use
    const dialog = document.getElementById("custom-dialog") as HTMLDivElement;
    const generateButton = document.getElementById("btn-generate") as HTMLButtonElement;
    const insertButton = document.getElementById("btn-insert") as HTMLButtonElement;
    const promptInput = document.getElementById("prompt-input") as HTMLInputElement;
    const chatMessagesDiv = document.getElementById("chat-messages") as HTMLDivElement;

    // Variable to hold the last generated response and reference to the message input container
    let latestMessage = "";
    let messageContainer: HTMLElement | null = null;

    // Add event listener to track clicks on LinkedIn message input areas
    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element is a message input area
      if (
        target.matches(".msg-form__contenteditable") ||
        target.closest(".msg-form__contenteditable")
      ) {
        // Reference the parent container of the message input area
        messageContainer =
          target.closest(".msg-form__container") ||
          target.closest(".msg-form__contenteditable");

        const contentArea = messageContainer?.closest(".msg-form_msg-content-container");

        // Activate and focus the message form
        if (messageContainer && contentArea) {
          contentArea.classList.add("msg-form_msg-content-container--is-active");
          messageContainer.setAttribute("data-artdeco-is-focused", "true");
        }

        // Check if the edit icon is already added; if not, inject it
        if (messageContainer && !messageContainer.querySelector(".edit-icon")) {
          messageContainer.style.position = "relative";

          const iconElement = document.createElement("img");
          const iconWrapper = document.createElement("div");
          iconWrapper.className = "edit-icon-container";
          iconWrapper.style.position = "absolute";
          iconWrapper.style.bottom = "5px";
          iconWrapper.style.right = "5px";
          iconWrapper.style.width = "32px";
          iconWrapper.style.height = "32px";
          iconWrapper.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
          iconWrapper.style.borderRadius = "50%";
          
          messageContainer.appendChild(iconWrapper);
          iconWrapper.appendChild(iconElement);
          iconElement.className = "ai-icon";
          iconElement.src = aiIcon;
          iconElement.alt = "Custom Icon";
          iconElement.style.position = "absolute";
          iconElement.style.bottom = "8px";
          iconElement.style.right = "7px";
          iconElement.style.width = "15px";
          iconElement.style.height = "15px";
          iconElement.style.cursor = "pointer";
          iconElement.style.zIndex = "1000";
          
          // Open the dialog when the edit icon is clicked
          iconElement.addEventListener("click", (e) => {
            e.stopPropagation();
            dialog.style.display = "flex";
          });
        }
      }
    });

    // Function to create a sample response
    const createResponse = () => {
      const responses = [
        "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.",
      ];
      return responses[0]; // Return a sample response
    };

    // Event listener for the 'Generate' button
    generateButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent the event from bubbling

      // Get the user input from the text field
      const inputValue = promptInput.value.trim();
      if (!inputValue) return; // Exit if input is empty

      // Display the user's message in the messages container
      const userMessageDiv = document.createElement("div");
      userMessageDiv.textContent = inputValue;
      Object.assign(userMessageDiv.style, {
        backgroundColor: "#DFE1E7",
        color: "#666D80",
        borderRadius: "12px",
        padding: "10px",
        marginBottom: "5px",
        textAlign: "right",
        maxWidth: "80%",
        alignSelf: "flex-end",
        marginLeft: "auto",
      });
      chatMessagesDiv.appendChild(userMessageDiv);

      // Disable the generate button and change its state to loading
      generateButton.disabled = true;
      generateButton.textContent = "Loading...";
      generateButton.style.backgroundColor = "#666D80";

      // Simulate an API call with a timeout to generate a response
      setTimeout(() => {
        latestMessage = createResponse(); // Generate a response
        const generatedMessageDiv = document.createElement("div");
        generatedMessageDiv.textContent = latestMessage;
        Object.assign(generatedMessageDiv.style, {
          backgroundColor: "#DBEAFE",
          color: "#666D80",
          borderRadius: "12px",
          padding: "10px",
          marginBottom: "5px",
          textAlign: "left",
          maxWidth: "80%",
          alignSelf: "flex-start",
          marginRight: "auto",
        });

        // Add the generated message to the messages container
        chatMessagesDiv.appendChild(generatedMessageDiv);
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // Scroll to the latest message

        // Enable the generate button and update its label to 'Regenerate'
        generateButton.disabled = false;
        generateButton.style.backgroundColor = "#007bff";
        generateButton.style.color = "white";
        generateButton.innerHTML = `<img src="${regenerateIcon}" alt="Regenerate" style="vertical-align: middle; margin-right: 5px; width: 16px; height: 16px"> <b>Regenerate</b>`;

        // Reset input field and show the insert button
        promptInput.value = "";
        insertButton.style.display = "inline-block";
      }, 500);
    });

    // Event listener for the 'Insert' button to add the generated response to the input area
    insertButton.addEventListener("click", () => {
      if (latestMessage && messageContainer) {
        // Clear aria-label to prevent screen reader issues
        messageContainer.removeAttribute("aria-label");

        // Find or create a <p> tag within the contenteditable area
        let existingParagraph = messageContainer.querySelector("p");

        if (!existingParagraph) {
          existingParagraph = document.createElement("p");
          messageContainer.appendChild(existingParagraph);
        }

        // Insert the new message into the paragraph
        existingParagraph.textContent = latestMessage;

        // Hide the insert button and close the dialog
        insertButton.style.display = "none";
        dialog.style.display = "none";
      }
    });

    // Ensure focus remains on the message input area when interacting with the dialog inputs
    const inputElements = [promptInput, generateButton, insertButton];
    inputElements.forEach((input) => {
      input.addEventListener("focus", () => {
        if (messageContainer) {
          messageContainer.setAttribute("data-artdeco-is-focused", "true");
        }
      });
      input.addEventListener("blur", () => {
        if (messageContainer) {
          messageContainer.setAttribute("data-artdeco-is-focused", "false");
        }
      });
    });
  },
});
