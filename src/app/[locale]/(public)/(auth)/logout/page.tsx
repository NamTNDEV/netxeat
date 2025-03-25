import { Metadata } from "next";
import Logout from "./logout";

export const metadata: Metadata = {
    title: 'Logout Redirect',
    description: 'Logout Redirect',
    robots: {
        index: false
    }
}

export default function RefreshTokenPage() {
    return (
        <Logout />
    )
}