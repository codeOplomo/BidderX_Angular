import { Collection } from "../../store/collections/collection.model";
import { WalletVM } from "./wallet-vm";

export interface ProfileVM {
    id?: string;
    email: string;
    profileIdentifier: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    hasWallet: boolean;
    coverImageUrl?: string;
    wallet?: WalletVM | null;
    collections?: Collection[];
    roles: string[];
    ownerRequestStatus?: string;
    isBanned?: boolean;
}
