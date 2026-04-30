const REGEX = {
    only_whole_numbers: /^[0-9]*$/,
    only_integers: /^-?\d+$/,
    test: (regex: RegExp, value: string) => {
        return regex.test(value)
    }
}

