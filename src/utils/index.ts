const objectIsEmpty = (value: object): boolean => {
    return Object.keys(value).length === 0
}

export { objectIsEmpty }