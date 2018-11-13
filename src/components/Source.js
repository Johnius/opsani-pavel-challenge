import React from 'react'

export default function Source({ title, icon }) {
    return (
        <div className="source">
            <div className="source__image-wrapper">
                <img
                    src={icon}
                    width={30}
                    height={30}
                    alt={title}
                    title={title}
                />
            </div>
            <div className="source__title">{title}</div>
        </div>
    )
}