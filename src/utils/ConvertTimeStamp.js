const ConvertTimeStamp = (Timestamp) => {
    Timestamp = Timestamp?.toString().replaceAll("Z", "").split("T");
    return Timestamp;
}

export default ConvertTimeStamp;