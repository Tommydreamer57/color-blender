angular.module('colorBlender', [])

angular.module('colorBlender').controller('colorCtrl', function ($scope) {

    $scope.toggleLeft = function () {
        if ($scope.leftIn) $scope.leftIn = false
        else $scope.leftIn = true
    }

    $scope.toggleRight = function () {
        if ($scope.rightIn) $scope.rightIn = false
        else $scope.rightIn = true
    }

    $scope.closeLeftAndRight = function () {
        $scope.rightIn = false
        $scope.leftIn = false
    }



    function disableInputs(parents) {
        parents.map(parent => {
            console.log(parent)
            if (!$scope.disabledInputs) $scope.disabledInputs = []
            if (!$scope.disabledInputs.includes(parent)) $scope.disabledInputs.push(parent)
            let color = document.getElementById(parent).children[1].children[0]
            let text = document.getElementById(parent).children[1].children[1]
            let opacity = {
                getAttribute: () => false,
                setAttribute: () => false
            }
            if (parent !== 'result12' && parent !== 'base') {
                opacity = document.getElementById(parent).children[2].children[0]
            }
            console.log(color, text, opacity)
            console.log($scope.disabledInputs)
            color.setAttribute('disabled', true)
            text.setAttribute('disabled', true)
            opacity.setAttribute('disabled', true)
        })
    }

    function enableInputs(parents) {
        parents.map(parent => {
            console.log(parent)
            if (!$scope.disabledInputs) $scope.disabledInputs = []
            if ($scope.disabledInputs.includes(parent)) {
                $scope.disabledInputs = $scope.disabledInputs.filter(item => item !== parent)
            }
            let color = document.getElementById(parent).children[1].children[0]
            let text = document.getElementById(parent).children[1].children[1]
            let opacity = {
                setAttribute: () => false,
                removeAttribute: () => false
            }
            if (parent !== 'result12' && parent !== 'base') {
                opacity = document.getElementById(parent).children[2].children[0]
            }
            color.removeAttribute('disabled')
            text.removeAttribute('disabled')
            opacity.removeAttribute('disabled')
        })
    }

    $scope.toggleMode = function (number) {
        $scope.mode = number
        console.log(number)
        let disabled = []
        let enabled = []
        let base = 'base'
        let color1 = 'color1'
        let color2 = 'color2'
        let result1 = 'result1'
        let result2 = 'result2'
        let result12 = 'result12'
        switch (Number(number)) {
            case 1: // free play
                disabled = [result12]
                enabled = [base, color1, color2, result1, result2]
                break;
            case 2: // find color one
                disabled = [color1]
                enabled = [base, color2, result1, result2, result12]
                break;
            case 3: // find mix
                disabled = []
                break;
            case 4: // find color 2
                disabled = [color2]
                enabled = [base, color1, ]
                break;
            case 5: // find base
                disabled = [base]
                enabled = [color1, color2, result1, result2, result12]
                break;
            default:
                console.log('invalid mode')
        }
        disableInputs(disabled)
        enableInputs(enabled)
    }


    $scope.calculateResults = function (input) {
        
        console.log('calculating results')

        let { base, color1, color2, opacity1, opacity2, result1, result2, result12, disabledInputs } = $scope

        console.log(base, color1, color2, opacity1, opacity2, result1, result2, result12, disabledInputs)

        if (input === 'base' || (input === 'color1' || input === 'color2')) {
            $scope.result1 = colorBlender(base, color1, opacity1)
            $scope.result2 = colorBlender(base, color2, opacity2)
            $scope.result12 = colorBlender($scope.result2, color1, opacity1)
        }

        if (input === 'result1') {
            if (disabledInputs.includes('base')) {
                $scope.base = baseFinder(result1, color1, opacity1)
            }
            else {
                $scope.color1 = colorFinder(result1, base, opacity1)
            }
        }

        if (input === 'result2') {
            if (disabledInputs.includes('base')) {
                $scope.base = baseFinder(result2, color2, opacity2)
            }
            else {
                $scope.color2 = colorFinder(result2, base, opacity2)
            }
        }

        if (input === 'result12') {
            if (disabledInputs.includes('color1')) {
                $scope.color1 = colorFinder(result12, result2, opacity1)
            }
            if (disabledInputs.includes('color2')) {
                $scope.color2 = colorFinder(result12, result1, opacity2)
            }
            if (disabledInputs.includes('base')) {
                $scope.base = baseFinder()
            }
        }

        console.log($scope.result1, $scope.result12, $scope.result2)
    }





    function colorToArray(color) {
        color = color.trim()
        if (color[0] === '#') {
            color = color.slice(1)
            if (color.length === 3) {
                color = color.split('').map(c => c.repeat(2))
            }
            else if (color.length === 6) {
                color = [color.slice(0, 2), color.slice(2, 4), color.slice(4, 6)]
            }
            else return 'Hexadecimal colors must contain 3 or 6 digits'

            let hexadecimal = {
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
                8: 8,
                9: 9,
                a: 10,
                b: 11,
                c: 12,
                d: 13,
                e: 14,
                f: 15
            }

            color = color.map(c => {
                c = c.toLowerCase()
                return hexadecimal[c[0]] * 16 + hexadecimal[c[1]]
            })

        }
        else if (color[0] === 'r') {
            color = color.slice(color.indexOf('(') + 1, color.length - 1).split(',').map(c => parseInt(c.trim(), 10))
        }
        else return 'Must input hexadecimal or rgb color'
        return color
    }



    function arrayToColor(color) {
        if (color.length === 4) return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
        if (color.length === 3) return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    }


    function rgbToHexadecimal(color) {
        if (!Array.isArray(color)) color = colorToArray(color)
        let hexadecimal = {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            10: 'A',
            11: 'B',
            12: 'C',
            13: 'D',
            14: 'E',
            15: 'F'
        }

        let toHex = c => {
            if (c % 16 === 0) return `${hexadecimal[c / 16]}0`
            else return `${hexadecimal[Math.floor(c / 16)]}${hexadecimal[c % 16]}`
        }

        let r = toHex(color[0])
        let g = toHex(color[1])
        let b = toHex(color[2])

        return `#${r}${g}${b}`

    }





    function colorBlender(base, color, opacity) {

        if (!Array.isArray(base)) base = colorToArray(base)
        if (!Array.isArray(color)) color = colorToArray(color)

        console.log(base, color, opacity)

        if (base[3] !== undefined && base[3] !== 1) return 'Base color must be opaque. If using rgba(), specify \'1\' as the alpha value'
        if (opacity !== undefined && color[3] !== undefined) return 'Define transparency either through using rgba() or specifying the opacity parameter, not both'
        if (!opacity && opacity !== 0) opacity = color[3]
        if (opacity <= 0 || color[3] <= 0) return 'Opacity/alpha must be greater than zero'
        if (!opacity) return 'Must specify opacity'
        if (opacity >= 1) return 'Opacity/alpha must be less than one'


        let blend = c => (base[c] * (1 - opacity) + color[c] * opacity).toFixed(0)

        let r = blend(0)
        let g = blend(1)
        let b = blend(2)

        let result = [r, g, b]

        return rgbToHexadecimal(result)

    }

    function colorFinder(result, base, opacity) {

        if (!Array.isArray(base)) base = colorToArray(base)
        if (!Array.isArray(result)) result = colorToArray(result)

        if (opacity <= 0) return 'Opacity must be greater than zero'
        if (!opacity) return 'Must specify opacity'
        if (opacity >= 1) return 'Opacity must be less than one'

        console.log(result, base, opacity)

        let unblend = c => ((result[c] - (base[c] * (1 - opacity))) / opacity).toFixed(0)

        let r = unblend(0)
        let g = unblend(1)
        let b = unblend(2)

        let color = [r, g, b, opacity]

        if (color.reduce((a, b) => a || (b < 0 || b > 255), false)) return 'Result not possible with given base & opacity'

        return rgbToHexadecimal(color)

    }

    function baseFinder(result, color, opacity) {

        if (!Array.isArray(result)) result = colorToArray(result)
        if (!Array.isArray(color)) color = colorToArray(color)

        if (opacity !== undefined && color[3] !== undefined) return 'Define transparency either through using rgba() or specifying the opacity parameter, not both'
        if (!opacity && opacity !== 0) opacity = color[3]
        if (opacity <= 0 || color[3] <= 0) return 'Opacity/alpha must be greater than zero'
        if (!opacity) return 'Must specify opacity'
        if (opacity >= 1) return 'Opacity/alpha must be less than one'

        console.log(result, color, opacity)

        let unblend = c => (result[c] - (color[c] * opacity) / (1 - opacity)).toFixed(0)

        let r = unblend(0)
        let g = unblend(1)
        let b = unblend(2)

        let base = [r, g, b]

        if (base.reduce((a, b) => a || (b < 0 || b > 255), false)) return 'Result not possible with given color & opacity'

        return rgbToHexadecimal(base)

    }

})


