import SparkMD5 from "spark-md5";
import React, { useEffect, useState } from "react";

import { Button } from "@photoncss/Button";
import { Card } from "@photoncss/Card";

const checksum = (file) =>
    new Promise((resolve, reject) => {
		const CHUCK_SIZE = 2097152;
        let currentChunk = 0;
        const chunks = Math.ceil(file.size / CHUCK_SIZE);
        const blobSlice =
            File.prototype.slice ||
            File.prototype.mozSlice ||
            File.prototype.webkitSlice;
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();

        const loadNext = () => {
            const start = currentChunk * CHUCK_SIZE;
            const end = start + CHUCK_SIZE >= file.size ? file.size : start + CHUCK_SIZE;
            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        };

        fileReader.onload = e => {
            spark.append(e.target.result);
            currentChunk++;

            if (currentChunk < chunks) loadNext();
            else resolve(spark.end());
        };

        fileReader.onerror = () => {
            return reject('Calculating file checksum failed');
        };

        loadNext();
    });

export default function Component() {
	const [ schem, setSchem ] = useState(null);
	useEffect(function() {
		if(schem === null) {
			$(".dropzone").on("dragenter dragover", function() {
				event.preventDefault();
				$(this).addClass("dropping")
			}).on("dragend", function() {
				event.preventDefault();
				$(this).removeClass("dropping")
			}).on("drop", function(event) {
				$(this).removeClass("dropping")
				event.preventDefault();
				const ev = event.originalEvent;
  				if (ev.dataTransfer.items) {
					if(ev.dataTransfer.items.length > 1) return Photon.Snackbar({ content: "Hey! One at a time please.", delay: 5000, classes: "red" });
					let [ file ] = ev.dataTransfer.items;
					if(file.kind !== "file") return;
					file = file.getAsFile();

					if(file.name.split(".")[file.name.split(".").length - 1] !== "schem") return Photon.Snackbar({ content: "File is not a Schematic.", delay: 5000, classes: "red" });
					if(file.size > 1048576) return Photon.Snackbar({ content: "Schematic exceeds 1 MB limit.", delay: 5000, classes: "red" });
					checksum(file).then(hash => {

						const formData = new FormData()
						formData.append(hash, file);
						fetch("https://mayhemmc.uk.to/api/upload-schematic", { method: "POST", body: formData })
						  .then(response => response.json())
						  .then(({ status }) => {
							if(status === "OK") {
								setSchem(hash);
							}
						});
						
					});
			  	}
			})
		}
	});
	return (
		<Card>
		  { schem === null && (
		    <div style={{ padding: "2rem 0", textAlign: "center" }} className="dropzone">
			  <h4>Drag and drop <code>.schem</code> files.</h4>
			  <p>Upload limit: <code>1 MB</code></p>
		    </div>
		  ) }
		  { schem !== null && (
		    <div style={{ padding: "2rem 0", textAlign: "center" }}>
			  <h4>Schematic Uploaded!</h4>
			  <h5><code>{`//schem load ${schem}`}</code></h5>
			  <Button variant="raised" color="accent" onClick={ () => setSchem(null) }>Upload another</Button>
		    </div>
		  ) }
		</Card>
	)
}
