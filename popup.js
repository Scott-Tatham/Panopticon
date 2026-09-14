document.getElementById('save-button').addEventListener('click', async () =>
{
	SaveLinks(false);
});

document.getElementById('save-as-button').addEventListener('click', async () =>
{
	SaveLinks(true);
});

function SaveLinks(chooseLocation)
{
	const statusText = document.getElementById('status');
	statusText.classList.remove('hidden');
	statusText.textContent = 'Searching tabs...';
	
	// Filter for all tabs that are at the YouTube base URL.
	chrome.tabs.query({ url: "https://*.youtube.com/watch?v=*" }, (tabs) =>
	{
		if (tabs.length === 0)
		{
			statusText.textContent = 'No open YouTube videos found.';
			
			return;
		}
		
		// Build the contents of the file.
		let fileContent = `------------------------------------------------\n`;
		fileContent += `Saved YouTube Tabs - ${new Date().toLocaleString()}\n`;
		fileContent += `------------------------------------------------\n\n`;
		
		tabs.forEach((tab, index) =>
		{
			fileContent += `${index + 1}. ${tab.title}\n`;
			fileContent += `URL: ${tab.url}\n\n`;
		});
		
		// Create a plain text blob with the file contents.
		const blob = new Blob([fileContent.trimEnd()], { type: 'text/plain' });
		const reader = new FileReader();
		
		// Invokes once the blob is loaded by the reader.
		reader.onloadend = function ()
		{
			chrome.downloads.download(
			{
				url: reader.result,
				filename: `Panopticon_${new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)}.txt`,
				saveAs: chooseLocation
			}, () =>
			{
				statusText.textContent = `Saved ${tabs.length} link${tabs.length > 0 ? 's' : ''}!`;
			});
		};
		
		// Load the blob.
		reader.readAsDataURL(blob);
	});
}