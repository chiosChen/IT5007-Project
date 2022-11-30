import React from "react";


export default function MaterialIcons({ children, ...rest }) {

	return (

		<span className="material-symbols-outlined" {...rest} >
				{children}
		</span>
	)
}



