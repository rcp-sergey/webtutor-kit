export function getEncodedParamValue(curParams: object, paramName: string, paramType: string, overrideWebTemplateID: number) {
    const defaultValue = paramType === "array" ? [] as any[] : null;
    // @ts-ignore next-line
    let rawValue = tools_web.get_web_param(curParams, paramName, defaultValue, true, overrideWebTemplateID);

    let paramValue;
    switch (paramType) {
        case "string":
            paramValue = { type: "string", value: rawValue != null ? rawValue : "" };
            break;
        case "number":
            paramValue = { type: "string", value: rawValue != null ? String(rawValue) : "" };
            break;
        case "date":
            paramValue = { type: "date", value: rawValue != null ? rawValue : "" };
            break;
        case "boolean":
            paramValue = { type: "string", value: tools_web.is_true(rawValue) };
            break;
        case "foreign_elem_ids":
            paramValue = { type: "array", value: getForeignElemIds(rawValue as string) };
            break;
        case "foreign_elem_id":
            paramValue = { type: "number", value: getForeignElemId(rawValue as string) };
            break;
        case "array":
            paramValue = { type: "array", value: rawValue };
            break;
        default:
            paramValue = { type: "string", value: String(rawValue) };
    }

    if (paramValue.value === "") {
        return "";
    }

    return Base64Encode(EncodeJson(paramValue));
}

function getForeignElemId(value: string): string | undefined {
    const elemIds = value.split(";");
    const firstElemIdNumber = OptInt(ArrayOptFirstElem(elemIds));
    if (firstElemIdNumber !== undefined) {
        return String(firstElemIdNumber);
    }
    return undefined;
}

function getForeignElemIds(value: string): string[] {
    const elemIds = value.split(";");
    const elemIdStrings: string[] = [];

    let elemId;
    let elemIdNumber: number;
    for (elemId in elemIds) {
        elemIdNumber = OptInt(elemId);
        if (elemIdNumber !== undefined) {
            elemIdStrings.push(String(elemIdNumber));
        }
    }

    return elemIdStrings;
}
