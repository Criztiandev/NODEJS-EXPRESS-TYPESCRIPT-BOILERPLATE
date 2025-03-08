import { google } from "googleapis";

class KPFormService {
  private readonly auth = new google.auth.GoogleAuth({
    keyFile: "google-key-file.json",
    scopes: ["https://www.googleapis.com/auth/forms"],
  });

  public async createHelloWorldForm() {
    try {
      // Initialize the Forms API
      const forms = google.forms({
        version: "v1",
        auth: this.auth,
      });

      // Create a new form
      const form = await forms.forms.create({
        requestBody: {
          info: {
            title: "Hello World Form",
            documentTitle: "Hello World Form",
          },
        },
      });

      // Get the form ID
      const formId = form.data.formId;

      if (!formId) {
        throw new Error("Failed to create form, no formId returned");
      }

      // Add a simple "Hello World" message as a form description
      await forms.forms.batchUpdate({
        formId: formId,
        requestBody: {
          requests: [
            {
              updateFormInfo: {
                info: {
                  description: "Hello World! This is my first Google Form.",
                },
                updateMask: "description",
              },
            },
            {
              createItem: {
                item: {
                  title: "Is this your first time using Google Forms?",
                  questionItem: {
                    question: {
                      required: true,
                      choiceQuestion: {
                        type: "RADIO",
                        options: [{ value: "Yes" }, { value: "No" }],
                      },
                    },
                  },
                },
                location: {
                  index: 0,
                },
              },
            },
          ],
        },
      });

      // Return the form details
      return {
        formId: formId,
        formUrl: `https://docs.google.com/forms/d/${formId}/edit`,
      };
    } catch (error) {
      console.error("Error creating form:", error);
      throw error;
    }
  }
}

export default new KPFormService();
