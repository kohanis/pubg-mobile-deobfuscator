import './main.css'

const encoded_field = document.getElementById("encoded") as HTMLTextAreaElement;
const decoded_field = document.getElementById("decoded") as HTMLTextAreaElement;

function flip(val: number) {
    return 127 - val ^ 0b110
}

function execute(in_ta: HTMLTextAreaElement, out_ta: HTMLTextAreaElement, parser: (idx: number, line: string) => string) {
    try {
        out_ta.value = '';
        let input = in_ta.value.split('\n');
        if (input.length == 0) {
            return;
        }
        let result = '';

        for (let idx = 0; idx < input.length; idx++) {
            let line = input[idx];
            if(line.length == 0)
            {
                continue;
            }
            result += parser(idx, line);
        }
        out_ta.value = result;
    } catch (err) {
        alert(err);
    }
}

function decode(idx: number, line: string): string {
    if(!line.startsWith('+CVars=') || line.length % 2 != 1)
    {
        throw `Wrong format on the line #${idx}`;
    }
    let result_cvar =   [];
    for (let idx = 7; idx < line.length; idx += 2) {
        let hex = line.slice(idx, idx + 2);
        let char = flip(parseInt(line.slice(idx, idx + 2), 16));
        if(char < 32 || char > 126){
            throw `Unsupported character "${hex}" on the line #${idx}`;
        }
        result_cvar.push(char);
    }
    return `+CVars=${String.fromCharCode(...result_cvar)}\n`;
}

function encode(idx: number, line: string): string {
    if(!line.startsWith('+CVars='))
    {
        throw `Wrong format on the line #${idx}`;
    }
    let result_cvar =   [];
    for (let idx = 7; idx < line.length; idx++) {
        let char_code = line.charCodeAt(idx);
        if(char_code < 32 || char_code > 126){
            throw `Unsupported character "${line[idx]}" on the line #${idx}`;
        }
        result_cvar.push(flip(char_code).toString(16).toUpperCase().padStart(2, '0'));
    }
    return `+CVars=${result_cvar.join('')}\n`;
}

(document.getElementById("decode_button") as HTMLButtonElement).addEventListener("click", () => execute(encoded_field, decoded_field, decode));
(document.getElementById("encode_button") as HTMLButtonElement).addEventListener("click", () => execute(decoded_field, encoded_field, encode));
