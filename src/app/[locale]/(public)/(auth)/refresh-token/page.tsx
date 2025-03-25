import { Metadata } from "next";
import RefreshToken from "./refresh-token";

export const metadata: Metadata = {
    title: 'Refresh token redirect',
    description: 'Refresh token redirect',
    robots: {
        index: false
    }
}

export default function RefreshTokenPage() {
    return (
        <RefreshToken />
    )
}