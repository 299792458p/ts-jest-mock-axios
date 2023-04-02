import axios from 'axios'

export const personsPerGroup = 4

export interface VerifyDiscountResponse {
    hasDiscount: boolean
}

export const calculatePrice = async (persons: number): Promise<number> => {
    const pricePerPerson = 340
    persons = persons < 0 ? 0 : persons
    const { data } = await axios.get<VerifyDiscountResponse>(`/verify-discount?amount=${persons}`)
    const hasDiscount = data.hasDiscount
    const groups = hasDiscount ? (persons / personsPerGroup) : 0
    return Math.floor(1.1 /* added vat */ * pricePerPerson * (persons - groups))
}
