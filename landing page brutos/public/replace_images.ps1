$path = 'c:\Users\danie\OneDrive\Documentos\landing page brutus\brutos-coin-landing (1).html'
$content = Get-Content $path
$content[1977] = '          src="public/BRUTOS.png"'
$content[2204] = '          src="public/BRUTOS.png"'
$content | Set-Content $path
