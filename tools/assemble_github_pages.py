"""Restore and verify the release files before publishing to GitHub Pages."""
from pathlib import Path
import hashlib
import json
import shutil
from zipfile import ZipFile


def main():
    root = Path(__file__).resolve().parents[1]
    manifest = json.loads((root / 'release.json').read_text(encoding='utf-8'))
    destination = root / '_site'
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(root / 'web', destination)
    archive = destination / 'game.zip'
    with archive.open('wb') as output:
        for item in manifest['parts']:
            source = root / 'payload' / item['name']
            if source.parent != root / 'payload':
                raise ValueError('Invalid archive part path')
            data = source.read_bytes()
            if len(data) != item['bytes'] or hashlib.sha256(data).hexdigest() != item['sha256']:
                raise ValueError('Archive part failed verification: ' + item['name'])
            output.write(data)
    for name, expected in manifest['files'].items():
        file = destination / name
        if not file.resolve().is_relative_to(destination.resolve()):
            raise ValueError('Invalid release path')
        if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != expected:
            raise ValueError('Release file failed verification: ' + name)
    with ZipFile(archive) as package:
        names = package.namelist()
        if package.testzip():
            raise ValueError('Game archive failed CRC verification')
        for name in names:
            parts = Path(name).parts
            if name.startswith('game/') and (
                any(p in ('saves', 'cache', '__pycache__') for p in parts)
                or Path(name).name.startswith('99_')
                or name.endswith('.rpy.test')
            ):
                raise ValueError('Test or runtime data in release: ' + name)
        required = ('game/18_guidance_screens.rpy', 'game/revision_interpretation.py')
        if not all(name in names for name in required):
            raise ValueError('Latest game sources missing')
    catalog = json.loads((destination / 'pwa_catalog.json').read_text())
    if not all((destination / name).is_file() for name in catalog['files']):
        raise ValueError('Offline catalog references missing files')
    (destination / '.nojekyll').touch()
    print('Verified release:', manifest['version'], '|', archive.stat().st_size, 'game bytes')


if __name__ == '__main__':
    main()
