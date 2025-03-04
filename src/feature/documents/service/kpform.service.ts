import { KPForm1Payload, KPForm2Payload } from "../interface/kpform.interface";
import { google } from "googleapis";
import { docs_v1 } from "googleapis";

/**
 * Interface for text location within a Google Doc
 */
interface TextLocation {
  segmentId: string;
  startIndex: number;
  endIndex: number;
  isBold?: boolean;
}

/**
 * Interface for text element range tracking
 */
interface ElementRange {
  start: number;
  end: number;
  elementStart: number;
  content: string;
  isBold: boolean;
}

/**
 * Service for handling Katarungang Pambarangay (KP) Form operations with Google Docs
 * This service can be used for all KP form types by implementing specific builder methods
 */
class KpformService {
  private auth = new google.auth.GoogleAuth({
    keyFile: "google-key-file.json",
    scopes: ["https://www.googleapis.com/auth/documents"],
  });

  /**
   * Main method to build a KP Form 1 document (Notice to Constitute the Lupon)
   */
  async buildKpform1(documentId: string, payload: KPForm1Payload) {
    // Set current date if not provided
    if (!payload.date) {
      payload.date = new Date();
    }

    // Transform the payload for template requirements
    const templateData = this.transformPayloadForTemplate(payload);

    // Fill the template with processed data
    return this.fillTemplateDocument(documentId, templateData);
  }

  /**
   * Method to build KP Form 2 document (Appointment)
   */
  async buildKpform2(documentId: string, payload: KPForm2Payload) {
    // Set current date if not provided
    if (!payload.date) {
      payload.date = new Date();
    }

    // Transform the payload for KP Form 2 template requirements
    const templateData = this.transformPayloadForKpform2(payload);

    // Fill the template with processed data
    return this.fillTemplateDocument(documentId, templateData);
  }

  /**
   * Method to build any KP form given a form type
   * This allows for a unified interface to build any KP form
   */
  async buildKpform(formType: string, documentId: string, payload: any) {
    switch (formType) {
      case "KPFORM-1":
        return this.buildKpform1(documentId, payload);
      case "KPFORM-2":
        return this.buildKpform2(documentId, payload);
      // Add cases for other KP form types
      default:
        throw new Error(`Unsupported KP form type: ${formType}`);
    }
  }

  /**
   * Transforms the input payload for KP Form 1 template use
   */
  private transformPayloadForTemplate(payload: KPForm1Payload): KPForm1Payload {
    const currentDate = new Date();

    // Format date string
    const formattedDate =
      payload.date instanceof Date
        ? this.formatDate(payload.date)
        : payload.date;

    // Get year info
    const currentYear = currentDate.getFullYear();
    const shortYear = currentYear.toString().slice(-2);

    // Get month name
    const month =
      payload.date instanceof Date
        ? this.formatDate(payload.date).split(" ")[0]
        : currentDate.toLocaleDateString("en-US", { month: "long" });

    // Set default values for required fields
    return {
      ...payload,
      date: formattedDate,
      year: payload.year || shortYear,
      month: month,
      barangay: payload.barangay || "BARANGAY NAME",
      barangayHead: payload.barangayHead || "PUNONG BARANGAY",
      lastDay: payload.lastDay || this.getDayWithOrdinal(currentDate.getDate()),
      luponMembers:
        payload.luponMembers ||
        payload.appointedPersons?.map((person) => person.name) ||
        [],
    };
  }

  /**
   * Transforms the input payload for KP Form 2 template use
   */
  private transformPayloadForKpform2(payload: KPForm2Payload): KPForm2Payload {
    const currentDate = new Date();

    // Format date string
    const formattedDate =
      payload.date instanceof Date
        ? this.formatDate(payload.date)
        : payload.date;

    // Set default values for required fields
    return {
      ...payload,
      date: formattedDate,
      municipality: payload.municipality || "Municipality",
      barangay: payload.barangay || "BARANGAY NAME",
      barangayHead: payload.barangayHead || "PUNONG BARANGAY",
      barangaySecretary: payload.barangaySecretary || "BARANGAY SECRETARY",
      appointmentTo: payload.appointmentTo || "APPOINTEE NAME",
    };
  }

  /**
   * Formats a Date object to "Month Day, Year" string
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  /**
   * Adds ordinal suffix to a day number (1st, 2nd, 3rd, etc.)
   */
  private getDayWithOrdinal(day: number): string {
    if (day > 3 && day < 21) return `${day}th`;

    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }

  /**
   * Creates placeholder-to-value mappings for KP Form 1
   */
  private createPlaceholderMappings(
    data: KPForm1Payload | KPForm2Payload
  ): Record<string, string> {
    const currentDate = new Date();
    const isKPForm2 = "appointmentTo" in data;

    // Create base mappings for common fields
    const mappings: Record<string, string> = {
      "(Municipality)": data.municipality || "Municipality",
      "(Barangay)": data.barangay || "Barangay Name",
      "(Date)": data.date?.toString() || this.formatDate(currentDate),
      "(Current-Date)": data.date?.toString() || this.formatDate(currentDate),
      "**(Date)**": data.date?.toString() || this.formatDate(currentDate),
      "(Barangay-Head)": data.barangayHead || "PUNONG BARANGAY",
      "(Barangay Head)": data.barangayHead || "PUNONG BARANGAY",
    };

    // Add KP Form 1 specific mappings
    if (!isKPForm2) {
      const form1Data = data as KPForm1Payload;
      mappings["(Month)"] =
        form1Data.month ||
        currentDate.toLocaleDateString("en-US", { month: "long" });
      mappings["(Day)"] =
        form1Data.lastDay || this.getDayWithOrdinal(currentDate.getDate());
      mappings["(Year)"] = form1Data.year
        ? `20${form1Data.year}`
        : currentDate.getFullYear().toString();

      // Add lupon members to mappings
      if (form1Data.luponMembers?.length) {
        for (let i = 0; i < Math.min(form1Data.luponMembers.length, 25); i++) {
          mappings[`(lupon-member-${i + 1})`] = form1Data.luponMembers[i];
        }
      }
    }
    // Add KP Form 2 specific mappings
    else {
      const form2Data = data as KPForm2Payload;
      mappings["(appointment-to)"] =
        form2Data.appointmentTo || "APPOINTEE NAME";
      mappings["(Barangay-Secretary)"] =
        form2Data.barangaySecretary || "BARANGAY SECRETARY";
    }

    return mappings;
  }

  /**
   * Main method to fill a template document with data
   */
  async fillTemplateDocument(
    documentId: string,
    data: KPForm1Payload | KPForm2Payload
  ) {
    const docs = google.docs({ version: "v1", auth: this.auth });

    try {
      // PHASE 1: Replace placeholders with values
      await this.performTextReplacements(docs, documentId, data);

      // PHASE 2: Apply underlining to replaced content
      return await this.applyUnderlineFormatting(docs, documentId, data);
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }

  /**
   * Performs text replacements in the document
   */
  private async performTextReplacements(
    docs: docs_v1.Docs,
    documentId: string,
    data: KPForm1Payload | KPForm2Payload
  ) {
    // Get document
    const document = await docs.documents.get({ documentId });

    // Generate mappings
    const placeholderMappings = this.createPlaceholderMappings(data);

    // Prepare requests
    const requests: docs_v1.Schema$Request[] = [];

    // Create replacement requests
    for (const [placeholder, replacement] of Object.entries(
      placeholderMappings
    )) {
      if (replacement) {
        requests.push({
          replaceAllText: {
            containsText: {
              text: placeholder,
              matchCase: true,
            },
            replaceText: replacement,
          },
        });
      }
    }

    // Execute replacements if any
    if (requests.length > 0) {
      await docs.documents.batchUpdate({
        documentId,
        requestBody: { requests },
      });
      console.log("Text replacements completed");
    } else {
      console.log("No text replacements to make");
    }
  }

  /**
   * Applies underlining to replaced content
   */
  private async applyUnderlineFormatting(
    docs: docs_v1.Docs,
    documentId: string,
    data: KPForm1Payload | KPForm2Payload
  ) {
    // Get updated document
    const document = await docs.documents.get({ documentId });

    // Generate mappings
    const placeholderMappings = this.createPlaceholderMappings(data);

    // Prepare requests
    const requests: docs_v1.Schema$Request[] = [];

    // List of texts that should not be underlined
    const excludeFromUnderlining = [
      "PUNONG BARANGAY",
      "BARANGAY SECRETARY",
      data.municipality, // Don't underline municipality
      data.barangay, // Don't underline barangay
    ];

    // List of placeholders that need extra underlining space
    const extraUnderlineSpace = [
      "(Barangay-Head)",
      "(Barangay Head)",
      "(Barangay-Secretary)",
      "(appointment-to)",
    ];

    // Process each replacement for underlining
    for (const [placeholder, replacement] of Object.entries(
      placeholderMappings
    )) {
      // Skip municipality and barangay placeholders
      if (placeholder === "(Municipality)" || placeholder === "(Barangay)") {
        continue;
      }

      // Skip if empty or in exclusion list
      if (!replacement || excludeFromUnderlining.includes(replacement))
        continue;

      // Special handling for Lupon Members in KP Form 1
      if (placeholder.includes("lupon-member")) {
        // Use specialized method for finding Lupon Members to avoid numbering
        const locations = this.findLuponMemberLocations(document.data);

        for (const location of locations) {
          // Skip bold locations (to avoid numbering)
          if (location.isBold) continue;

          // Include full word in underlining
          const extendedLocation = this.extendRangeForSpaces(
            document.data,
            location
          );

          requests.push({
            updateTextStyle: {
              textStyle: { underline: true },
              fields: "underline",
              range: {
                segmentId: extendedLocation.segmentId,
                startIndex: extendedLocation.startIndex,
                endIndex: extendedLocation.endIndex,
              },
            },
          });
        }
        continue;
      }

      // Special handling for fields that need extra space
      const needsExtraSpace = extraUnderlineSpace.includes(placeholder);

      // Find all instances of the replacement text
      const locations = this.findTextLocations(document.data, replacement);

      // Create an underline request for each location
      for (const location of locations) {
        // Skip if this is a bold instance of official titles
        if (
          location.isBold &&
          (replacement === data.barangayHead ||
            (data as KPForm2Payload).barangaySecretary === replacement)
        ) {
          continue;
        }

        // Include surrounding spaces for better appearance
        let extendedLocation = this.extendRangeForSpaces(
          document.data,
          location
        );

        // Add extra underlining space (5 characters) for special fields
        if (
          needsExtraSpace ||
          replacement === data.barangayHead ||
          (data as any).barangaySecretary === replacement ||
          (data as any).appointmentTo === replacement
        ) {
          extendedLocation = this.addExtraUnderlineSpace(
            document.data,
            extendedLocation,
            5
          );
        }

        // Add the underline request
        requests.push({
          updateTextStyle: {
            textStyle: { underline: true },
            fields: "underline",
            range: {
              segmentId: extendedLocation.segmentId,
              startIndex: extendedLocation.startIndex,
              endIndex: extendedLocation.endIndex,
            },
          },
        });
      }
    }

    // Special handling for placeholders that weren't replaced
    // Focus on the specific placeholders that need extra spacing
    const specialPlaceholders = [
      "(Barangay Head)",
      "(Barangay-Head)",
      "(appointment-to)",
      "(Barangay-Secretary)",
    ];

    for (const placeholder of specialPlaceholders) {
      const placeholderLocations = this.findTextLocations(
        document.data,
        placeholder
      );
      for (const location of placeholderLocations) {
        // First extend for spaces
        let extendedLocation = this.extendRangeForSpaces(
          document.data,
          location
        );

        // Then add extra space (5 characters)
        extendedLocation = this.addExtraUnderlineSpace(
          document.data,
          extendedLocation,
          5
        );

        requests.push({
          updateTextStyle: {
            textStyle: { underline: true },
            fields: "underline",
            range: {
              segmentId: extendedLocation.segmentId,
              startIndex: extendedLocation.startIndex,
              endIndex: extendedLocation.endIndex,
            },
          },
        });
      }
    }

    // Execute underlining if any
    if (requests.length > 0) {
      const response = await docs.documents.batchUpdate({
        documentId,
        requestBody: { requests },
      });
      console.log("Underlining completed successfully");
      return response.data;
    } else {
      console.log("No underlining to apply");
      return null;
    }
  }

  /**
   * Special method to find Lupon Member locations without including the numbering
   */
  private findLuponMemberLocations(document: any): Array<TextLocation> {
    const locations: Array<TextLocation> = [];

    if (!document?.body?.content) return locations;

    // Process document content recursively
    const processElement = (element: any, segmentId: string = "") => {
      if (!element) return;

      // Handle paragraphs
      if (element.paragraph?.elements) {
        const paragraph = element.paragraph;

        // Build full paragraph text
        let fullText = "";
        const elementRanges: ElementRange[] = [];

        // Collect text and track ranges
        for (const textElement of paragraph.elements) {
          if (textElement.textRun?.content) {
            const start = fullText.length;
            fullText += textElement.textRun.content;
            const end = fullText.length;

            // Determine if text is bold
            const isBold = Boolean(textElement.textRun.textStyle?.bold);

            // Store element information
            elementRanges.push({
              start,
              end,
              elementStart: textElement.startIndex ?? 0,
              content: textElement.textRun.content,
              isBold,
            });
          }
        }

        // Find Lupon Members but exclude numbering
        const luponRegex = /Lupon Member \d+/g;
        let match;
        const fullTextStr = fullText.toString();

        while ((match = luponRegex.exec(fullTextStr)) !== null) {
          const fullMatch = match[0]; // e.g., "Lupon Member 1"
          const pos = match.index;

          // Find which element contains this occurrence
          for (const range of elementRanges) {
            // Make sure the match isn't in a bold element (to avoid numbering)
            if (!range.isBold && pos >= range.start && pos < range.end) {
              const startIndex = range.elementStart + (pos - range.start);
              const endIndex = startIndex + fullMatch.length;

              // Add location to results
              locations.push({
                segmentId,
                startIndex,
                endIndex,
                isBold: false,
              });
              break;
            }
          }
        }
      }

      // Handle tables
      if (element.table?.tableRows) {
        for (const row of element.table.tableRows) {
          if (row.tableCells) {
            for (const cell of row.tableCells) {
              if (cell.content) {
                for (const cellElement of cell.content) {
                  processElement(cellElement, segmentId);
                }
              }
            }
          }
        }
      }

      // Process nested elements
      if (element.content) {
        for (const contentElement of element.content) {
          processElement(contentElement, segmentId);
        }
      }
    };

    // Process all document content
    for (const contentElement of document.body.content) {
      processElement(contentElement);
    }

    return locations;
  }

  /**
   * Finds all occurrences of text in the document
   */
  private findTextLocations(
    document: any,
    searchText: string
  ): Array<TextLocation> {
    const locations: Array<TextLocation> = [];

    if (!document?.body?.content) return locations;

    // Special case for Lupon Members
    const isLuponMember = searchText.includes("Lupon Member");

    // Process document content recursively
    const processElement = (element: any, segmentId: string = "") => {
      if (!element) return;

      // Handle paragraphs
      if (element.paragraph?.elements) {
        const paragraph = element.paragraph;

        // Build full paragraph text
        let fullText = "";
        const elementRanges: ElementRange[] = [];

        // Collect text and track ranges
        for (const textElement of paragraph.elements) {
          if (textElement.textRun?.content) {
            const start = fullText.length;
            fullText += textElement.textRun.content;
            const end = fullText.length;

            // Determine if text is bold
            const isBold = Boolean(textElement.textRun.textStyle?.bold);

            // Store element information
            elementRanges.push({
              start,
              end,
              elementStart: textElement.startIndex ?? 0,
              content: textElement.textRun.content,
              isBold,
            });
          }
        }

        // Regular search case
        if (!isLuponMember) {
          // Find all occurrences of searchText
          let pos = 0;
          while ((pos = fullText.indexOf(searchText, pos)) !== -1) {
            // Find which element contains this occurrence
            for (const range of elementRanges) {
              if (pos >= range.start && pos < range.end) {
                const startIndex = range.elementStart + (pos - range.start);
                const endIndex = startIndex + searchText.length;

                // Add location to results
                locations.push({
                  segmentId,
                  startIndex,
                  endIndex,
                  isBold: range.isBold,
                });
                break;
              }
            }
            pos += 1;
          }
        }
        // Special case for Lupon Members
        else {
          // Find exact Lupon Member matches without numbering or asterisks
          const luponRegex = /Lupon Member \d+/g;
          let match;
          const fullTextStr = fullText.toString();

          while ((match = luponRegex.exec(fullTextStr)) !== null) {
            const fullMatch = match[0]; // e.g., "Lupon Member 1"
            const pos = match.index;

            // Find which element contains this occurrence
            for (const range of elementRanges) {
              // Make sure the match isn't in a bold element (to avoid numbering)
              if (!range.isBold && pos >= range.start && pos < range.end) {
                const startIndex = range.elementStart + (pos - range.start);
                const endIndex = startIndex + fullMatch.length;

                // Add location to results
                locations.push({
                  segmentId,
                  startIndex,
                  endIndex,
                  isBold: false,
                });
                break;
              }
            }
          }
        }
      }

      // Handle tables
      if (element.table?.tableRows) {
        for (const row of element.table.tableRows) {
          if (row.tableCells) {
            for (const cell of row.tableCells) {
              if (cell.content) {
                for (const cellElement of cell.content) {
                  processElement(cellElement, segmentId);
                }
              }
            }
          }
        }
      }

      // Process nested elements
      if (element.content) {
        for (const contentElement of element.content) {
          processElement(contentElement, segmentId);
        }
      }
    };

    // Process all document content
    for (const contentElement of document.body.content) {
      processElement(contentElement);
    }

    return locations;
  }

  /**
   * Extends a text range to include surrounding spaces and ensure full words are underlined
   */
  private extendRangeForSpaces(
    document: any,
    location: TextLocation
  ): TextLocation {
    // Create a copy to avoid modifying the original
    const result = { ...location };

    if (!document?.body?.content) return result;

    // Helper function to get the character at a specific index
    const getCharAt = (index: number): string | null => {
      for (const element of document.body.content) {
        if (element.paragraph) {
          for (const textElement of element.paragraph.elements) {
            if (textElement.textRun?.content) {
              const startIdx = element.startIndex;
              const endIdx = startIdx + textElement.textRun.content.length;

              if (index >= startIdx && index < endIdx) {
                const relativeIdx = index - startIdx;
                return textElement.textRun.content.charAt(relativeIdx);
              }
            }
          }
        }
      }
      return null;
    };

    // Function to check if a character is part of a word (not whitespace or punctuation)
    const isWordChar = (char: string | null): boolean => {
      if (!char) return false;
      return /[a-zA-Z0-9]/.test(char);
    };

    // Function to check if a position is a space
    const isSpaceAt = (index: number): boolean => {
      const char = getCharAt(index);
      return char === " ";
    };

    // Include space before
    if (result.startIndex > 0 && isSpaceAt(result.startIndex - 1)) {
      result.startIndex--;
    }

    // Include space after
    if (isSpaceAt(result.endIndex)) {
      result.endIndex++;
    }

    // For multi-word phrases, make sure we include all words
    // This extends the range to include any additional words after the initial match
    let nextIndex = result.endIndex;
    let char = getCharAt(nextIndex);

    // Keep extending if we find more word characters or spaces
    // This ensures we catch the entire phrase, not just the first word
    while (char && (isWordChar(char) || char === " ")) {
      result.endIndex++;
      nextIndex++;
      char = getCharAt(nextIndex);

      // Exit if we hit certain punctuation that would indicate the end of the phrase
      if (char === "." || char === "," || char === ";" || char === ":") {
        break;
      }
    }

    return result;
  }

  /**
   * Adds extra space to underlining (for specific fields that need longer underlines)
   */
  private addExtraUnderlineSpace(
    document: any,
    location: TextLocation,
    extraChars: number = 5
  ): TextLocation {
    // Create a copy to avoid modifying the original
    const result = { ...location };

    if (!document?.body?.content) return result;

    // Extend the start index by the specified amount
    // but ensure we don't go below 0
    result.startIndex = Math.max(0, result.startIndex - extraChars);

    // Extend the end index by the specified amount
    // We don't need to check for maximum since it's safe to go beyond
    result.endIndex = result.endIndex + extraChars;

    return result;
  }
}

export default new KpformService();
