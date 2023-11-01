import React from 'react'

interface Prop{
    open:string
}

const Dialog = (open:Prop) => {
    return (
        <div>{/* The button to open modal */}
            <a href="#my_modal_8" className="btn">open modal</a>
            {/* Put this part before </body> tag */}
            <div className={`modal ${open}`} id="my_modal_8">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">This modal works with anchor links</p>
                    <div className="modal-action">
                        <a href="#" className="btn">Yay!</a>
                    </div>
                </div>
            </div></div>
    )
}

export default Dialog