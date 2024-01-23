'use client'

import { useUser } from "../auth/page";

const Avatar = () => {

    // const activeUser = useUser();
    // const initials = activeUser?.nameUser.split(" ").map((n) => n[0]).join(".");

    return (
        <div className="stat">
            {/* <div className="stat-figure text-secondary">
                <div className="avatar online">
                    <div className="avatar online placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-16">
                            <span className="text-xl">{initials}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="stat-title">Zalogowany:</div>
            <div className="stat-title">{activeUser?.nameUser}</div>
            <div className="stat-desc text-secondary">{activeUser.role}</div> */}
        </div>
    )
}

export default Avatar