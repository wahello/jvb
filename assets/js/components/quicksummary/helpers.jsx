import React from 'react';

export class DataCell extends React.PureComponent {
	render(){
		const {data, rowIndex, columnKey, ...props} = this.props;
		return (
			<Cell {..props}>
				{data.getObjectAt(rowIndex)[columnKey]}
			</Cell>
		);
	}
};