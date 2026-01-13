function ContentHeader({title, description}) {
    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-teal-600">{title}</h1>
            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
    )

}


export default ContentHeader;