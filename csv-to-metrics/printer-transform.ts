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
    metrics: Metrics,
    blocks: Block[]
}

interface Block {
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
        name: toSnakeCase(fe.printerName),
        blocks: [] as Block[],
        metrics: {
            workEnvelope: {
                shape: fe.we_shape.toLowerCase(),
                dimensions: {
                    width: parseInt(fe.we_width.replace('mm', '')) || 0,
                    length: parseInt(fe.we_length.replace('mm', '')) || 0,
                    height: parseInt(fe.we_height.replace('mm', '')) || 0
                },
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            footprint: {
                width: parseInt(fe.fp_width.replace('mm', '')) || 0,
                length: parseInt(fe.fp_height.replace('mm', '')) || 0,
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

const toSnakeCase = (original: string) : string => {
    return original.toLowerCase().replace(/\s/g, '_');
};

const saveEntriesAsFiles = (entries: Entry[]) => {
    let path = './printers/';
    entries.forEach((entry) => {
        const jsonStr = JSON.stringify(entry, undefined, 2);
        fs.writeFile(`${path}${entry.name}.json`, jsonStr, (err: Error) => {
            if (err) {
                console.error(err);
            }
        });
    });
};

const main = () => {
    const flatEntries = loadJsonAsObj('');
    const entries = transformFlatEntries(flatEntries);
    saveEntriesAsFiles(entries);
};

main();
