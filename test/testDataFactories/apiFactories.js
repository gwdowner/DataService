//#region PV LIVE DATA
module.exports.pvliveValidHistoric = () => {
    // returns list of data responses
    return [
        [

            [22, '2020-02-07T17:00:00.000Z', 721.3],
            [22, '2020-02-07T17:30:00.000Z', 200],
            [22, '2020-02-07T18:00:00.000Z', 1]

        ],
        [
            [20, '2020-02-07T17:00:00.000Z', 234.88],
            [20, '2020-02-07T17:30:00.000Z', 0]

        ]
    ];
}

module.exports.pvliveValidRegional = () => {
    return [
        {
            "pes_id": 20,
            "pes_name": "_H",
            "pes_longname": "Southern England",
            "pes_dno": "Scottish and Southern Energy (Southern)"
        }
        ,
        {
            "pes_id": 22,
            "pes_name": "_L",
            "pes_longname": "South Western England",
            "pes_dno": "WPD (South West)"
        }
    ];
}

module.exports.pvLiveRawValidRegional = () => {
    return {
        "data": [
            [20, "_H", "Southern England", "Scottish and Southern Energy (Southern)"],
            [22, "_L", "South Western England", "WPD (South West)"]
        ],
        "meta": ["pes_id", "pes_name", "pes_longname", "pes_dno"]
    }
};
//#endregion