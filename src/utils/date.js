export const getDate = (dateTimeStamp) => {
	const date = new Date(dateTimeStamp * 1000); // x1000 to convert from seconds to milliseconds 
	let stringDate = date.toUTCString();
	stringDate = stringDate.substring(0, stringDate.indexOf("GMT")) + "UTC";
	return stringDate;
}