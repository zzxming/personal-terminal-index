

const command = {
    name: 'clear',
    desc: '清屏',
    param: {},
    option: [],
    action(args, commandHandle) {
        // console.log(commandHandle)
        commandHandle.clearCommand();
        return '';
    }
}

export {
    command
}