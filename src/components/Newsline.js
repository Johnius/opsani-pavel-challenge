import React from 'react'

export default function Newsline({title, date, source, description}) {
    return (
        <div className="card">
            <h3 className="card__title">{title}</h3>
            <span className="card__meta">
                <span className="card__date">{date}</span>
                <span className="card__source">{source}</span>
            </span>
            <div className="card__desc">
                {description}
            </div>
        </div>
    )
}