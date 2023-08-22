import Layout from "@/components/layout";
import {useSession} from "next-auth/react";

export default function Home() {
    const {data:session} = useSession()
    return <Layout>
            <div className="text-blue-900 flex justify-between">
                <h2>
                    Hello, <b>{session?.user?.email}</b>
                </h2>
                <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
                    <img src={session?.user?.image} alt="" className="w-9 h-9"/>
                    <span className="py-1 px-2">
                        {session?.user?.name}
                    </span>

                </div>
            </div>
        </Layout>

}
