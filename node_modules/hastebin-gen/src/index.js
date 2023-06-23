const fetch = require("node-fetch");

module.exports = async (input, options = {}) => {
    if (!input) throw new Error("Input is a required argument");

    if (typeof options === "string") options = { url: "https://hastebin.com", extension: options };

    const url = "url" in options ? options.url : "https://hastebin.com";
    const extension = "extension" in options ? options.extension : "js";

    const res = await fetch(`${url}/documents`, {
        method: "POST",
        body: input,
        headers: { "Content-Type": "text/plain" }
    });

    if (!res.ok) throw new Error(res.statusText);

    const { key } = await res.json();

    return `${url}/${key}.${extension}`;
};
