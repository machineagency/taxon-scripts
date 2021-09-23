interface FlatEntry {
    printerName: string,
    link: string,
    price: string,
    we_shape: string,
    we_width: string,
    we_height: string,
    we_length: string,
    mc_include: string,
    mc_exclude: string,
    fp_width: string,
    fp_height: string,
    strategies: string,
    technologies: string
}

interface Entry {
    name: string,
    metrics: Metrics
}

interface Dimensions {
    width: number,
    height: number,
    length: number
}

interface TPosition {
    x: number,
    y: number,
    z: number
}

interface Metrics {
    workEnvelope: { shape: string, dimensions: Dimensions, position: TPosition },
    footprint: { width: number, length: number },
    manufacturingStrategies: string[],
    materialCompatibility: { include: string[], exclude: string[] },
    metafeatures: { vendorInfo: { price: number, website: string } }
}

const fs = require('fs');

const loadJsonAsObj = (filename: string) : FlatEntry[] => {
    let fileStr = fs.readFileSync('./printers.json');
    let flatEntries = JSON.parse(fileStr) as FlatEntry[];
    return flatEntries;
};

const buildEntry = (fe: FlatEntry) : Entry => {
    let allStrategies = fe.strategies.split(',')
                            .concat(fe.technologies.split(', '));
    let newEntry : Entry = {
        name: fe.printerName,
        metrics: {
            workEnvelope: {
                shape: fe.we_shape,
                dimensions: {
                    width: parseInt(fe.we_width.replace('mm', '')),
                    length: parseInt(fe.we_length.replace('mm', '')),
                    height: parseInt(fe.we_height.replace('mm', ''))
                },
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            footprint: {
                width: parseInt(fe.fp_width.replace('mm', '')),
                length: parseInt(fe.fp_height.replace('mm', '')),
            },
            manufacturingStrategies: allStrategies,
            materialCompatibility: {
                include: fe.mc_include.split(', '),
                exclude: fe.mc_exclude.split(', ')
            },
            metafeatures: {
                vendorInfo: {
                    price: parseInt(fe.price.replace('$', '')) || 0,
                    website: fe.link
                }
            }
        }
    };
    return newEntry;
};

const transformFlatEntries = (flatEntries: FlatEntry[]) : Entry[] => {
    return flatEntries.map(entry => buildEntry(entry));
};

const saveJsonObj = (jsonObj: Object) => {
    const jsonStr = JSON.stringify(jsonObj, undefined, 2);
    fs.writeFileSync('transformed-printers.json', jsonStr);
}

const main = () => {
    const flatEntries = loadJsonAsObj('');
    const entries = transformFlatEntries(flatEntries);
    saveJsonObj(entries);
};

main();
