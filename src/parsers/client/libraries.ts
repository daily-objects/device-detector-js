import { Libraries } from "../../typings/device-detector";
import { formatVersion } from "../../utils/version";
import { variableReplacement } from "../../utils/variable-replacement";
import { userAgentParser } from "../../utils/user-agent";
import { loadRegexes } from "../../utils/yaml-loader";

interface LibrariesResult {
  client: {
    type: string;
    name: string;
    version: string;
    url: string;
  }
}

const libraries: Libraries = loadRegexes("client/libraries");

export default class LibraryParser {
  public detect = (userAgent: string): LibrariesResult => {
    const result: LibrariesResult = {
      client: {
        type: "",
        name: "",
        version: "",
        url: ""
      }
    };

    for (const library of libraries) {
      const match = userAgentParser(library.regex, userAgent);

      if (!match) continue;

      result.client.type = "library";
      result.client.name = variableReplacement(library.name, match);
      result.client.version = formatVersion(variableReplacement(library.version, match));
      result.client.url = library.url || "";

      break;
    }

    return result;
  };
}
