angular.module('colorBlender', [])

angular.module('colorBlender').controller('colorCtrl', function ($scope) {

    $scope.selection = []
    
    $scope.calculateResults = function () {
        let { base, color1, color2, color3, opacity1, opacity2, opacity3 } = $scope
        console.log('calculating results')
        console.log(opacity1, opacity2)
        $scope.result1 = colorBlender(base, color1, opacity1)
        $scope.result2 = colorBlender(base, color2, opacity2)
        $scope.result12 = colorBlender($scope.result2, color1, opacity1)
        console.log($scope.result1, $scope.result12, $scope.result2)
    }

    $scope.calculateColor = function () {
        let { base, opacity1, opacity2, opacity3, result1, result12, result2 } = $scope
        $scope.color1 = colorFinder(result1, base, opacity1)
        $scope.color2 = colorFinder(result2, base, opacity2)
        $scope.result12 = colorBlender(result2, $scope.color1, opacity1)
    }

    

    $scope.selectResult = function (number) {
        if ($scope.selection.includes(number)) $scope.selection = $scope.selection.filter(n => n !== number)
        else $scope.selection.push(number)
        if ($scope.selection.length >= 2) {
            let oldNumber = $scope.selection.shift()
            let oldElement = document.getElementById(`result${oldNumber}`)
            let oldColor = oldElement.children[0]
            let oldText = oldElement.children[1]
            if (oldColor.disabled === false || oldText.disabled === false) {
                console.log('setting disabled = true ', number)
                oldColor.setAttribute('disabled', true)
                oldText.setAttribute('disabled', true)
            }
            else {
                console.log('removing disabled ', number)
                oldColor.removeAttribute('disabled')
                oldText.removeAttribute('disabled')
            }
        }
            
        let element = document.getElementById(`result${number}`)
        let color = element.children[0]
        let text = element.children[1]
        if (color.disabled === false || text.disabled === false) {
            console.log('setting disabled = true ', number)
            color.setAttribute('disabled', true)
            text.setAttribute('disabled', true)
        }
        else {
            console.log('removing disabled ', number)
            color.removeAttribute('disabled')
            text.removeAttribute('disabled')
        }
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


