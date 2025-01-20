import { Collection } from "../collections/collection.model";

export interface User {
    profileIdentifier?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    imageUrl?: string; 
    coverImageUrl?: string;
    collections?: Collection[];
    message?: string;
  }
  