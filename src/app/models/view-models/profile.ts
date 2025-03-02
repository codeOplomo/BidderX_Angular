import { WalletVM } from "./wallet-vm";

export interface ProfileVM {
    email: string;
    profileIdentifier: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    coverImageUrl: string;
    wallet?: WalletVM;
}
