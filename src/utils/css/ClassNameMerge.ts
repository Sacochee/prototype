export default function(arg : any[]){
    return `${arg.map(item => item+" ")}`.replaceAll(',', '')
}