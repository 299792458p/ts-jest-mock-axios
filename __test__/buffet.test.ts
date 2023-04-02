import axios, { AxiosRequestConfig } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import qs from 'qs'
import { personsPerGroup, calculatePrice, VerifyDiscountResponse } from '../src/buffet'

describe('Buffet discount', () => {
    const mock = new MockAdapter(axios)
    const cases = [
        [-1, 0],
        [0, 0],
        [1, 374],
        [2, 748],
        [3, 1_122],
        [4, 1_122],
        [5, 1_870],
        [6, 2_244],
        [7, 2_618],
        [8, 2_244]
    ]

    beforeEach(() => {
        mock.reset()
    })

    test.each(cases)(
        'given %p, returns %p', async (input, expected) => {
            mock.onGet(/\/verify-discount\/?.*/)
                .reply((config: AxiosRequestConfig): [number, VerifyDiscountResponse] => {
                    const url = config.url ?? ''
                    const queryString = url.replace(/.*\?/, '')
                    const params = qs.parse(queryString)
                    const amount = Number(params.amount)
                    return [200, { hasDiscount: !(amount % personsPerGroup) }]
                })
            const result = await calculatePrice(input)
            expect(result).toBe(expected)
        }
    )
})
