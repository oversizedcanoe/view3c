# view3c
A browser-based W3C log file visualizer built with [Apache Echarts](https://echarts.apache.org/en/index.html).

### What is it?
[view3c](https://github.com/oversizedcanoe/view3c) is web application which enables users to upload W3C-formatted logs and visualize them as simple and straightfoward charts. No data leaves your device: everything happens locally in your browser.

Start by uploading a file or copy pasting it's text contents. Or, upload multiple files at once, and the logs will be merged and sorted chronologically.


### What is W3C?
The W3C Extended Log File Format is a standard logging format. See [Microsoft's documentation](https://learn.microsoft.com/en-us/windows/win32/http/w3c-logging) and [W3's documentation](https://www.w3.org/TR/WD-logfile).

Many applications support W3C logging, such as IIS (see [Configure Logging in IIS](https://learn.microsoft.com/en-us/iis/manage/provisioning-and-managing-iis/configure-logging-in-iis)) and Azure App (see [Enable diagnostic logging for apps in Azure App Service
](https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs)).

### Why should I use it?
Raw log files are great, but they can be hard to mentally process and comb through. It's hard to get a high-level view of patterns or problems from them. Visually presenting the logs makes it easier to process and understand your data, which helps to prevent and/or fix issues.

Other advantages include:
 - No download required. Everything is web-based.
 - No sign ups required. Everything is free.
 - Your files **always stay local**. They are never uploaded to a remote server.

### How?
 - Coming soon



#### To Do
 - More charts. Add tabular data representation too
   - Request time-taken as percentiles (25% less than x ms, 50% less than y %, etc)
   - Could switch "Requests per Endpoint" to be tabular, probably easier to read 
 - Fill out "How?" section above