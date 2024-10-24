interface Tap {

    clicker: number
    energy: number
    filling_time: {
        second: number,
        time: number,
        level_speed_energy: number,
        level_energy: number,
        final_capacity: number,
        filled_volume: number
    }
    first_name: string
    max_energy: number
    user_balance: number
}

interface Rewards {
    name: string
    activate: boolean,
    id: string,
    coin: number
}

interface ReferralList {
    name : string
    permium : string
    coin : number
}