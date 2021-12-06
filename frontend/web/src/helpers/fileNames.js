const cutExtensionFromFile = (name) => {
    return name.replace(/\.[^/.]+$/, "");
}

const getOnlyExtensionFromFile = (name) => {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(name)[1];
}

export {
    cutExtensionFromFile,
    getOnlyExtensionFromFile
}