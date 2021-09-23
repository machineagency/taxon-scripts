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

interface Position {
    x: number,
    y: number,
    z: number
}

interface Metrics {
    workEnvelope: { shape: string, dimensions: Dimensions, position: Position },
    footprint: { dimensions: Dimensions },
    manufacturingStrategies: string[],
    materialCompatibility: { include: string[], exclude: string[] },
    metafeatures: { vendorInfo: { cost: number, website: string } }
}

const fs = (require as any)('fs');

const loadJsonAsObj = (filename: string) : Object => {
    let fileStr = fs.readFileSync('./printers.json');
    let entries = JSON.parse(fileStr);
    entries = entries.forEach(entry => {
        entry.manufacturingStrategies = entry.manufacturingStrategies.split(',');
    });
};

const buildEntry = (fe: FlatEntry) : Entry => {
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
                    x: entry.metrics.workEnvelope.position.x,
                    y: entry.metrics.workEnvelope.position.y,
                    z: entry.metrics.workEnvelope.position.z
                }
            },
            footprint: {
                dimensions: {
                    width: entry.metrics.footprint.dimensions.width,
                    length: entry.metrics.footprint.dimensions.length,
                    height: entry.metrics.footprint.dimensions.height
                }
            },
            manufacturingStrategies: entry.metrics.manufacturingStrategies,
            materialCompatibility: {
                include: [],
                exclude: []
            },
            metafeatures: {
                vendorInfo: {
                    price: 42,
                    website: 'foo'
                }
            }
        }
    };
    return newEntry;
};

const transformEntireObj = (topLevelObject: Object) : Object => {
    let newArray = [];
};

const saveJsonObj = (jsonObj: Object) => {
    fs.open('transformed-printer.json', 'w', (err, fd) => {
        if (err) {
            console.error(err);
        }
        else {
            const str = JSON.stringify(jsonObj, undefined, 2);
            fd.write(str).then((bytesWritten, buffer) => {
                console.log(`Wrote ${bytesWritten} bytes`);
            });
        }
    });
}

const main = () => {
    const oldJson = loadJsonAsObj('');
    const newJson = transformEntireObj(oldJson);
    saveJsonObj(newJson);
};

main();
