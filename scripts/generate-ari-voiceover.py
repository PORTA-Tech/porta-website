import asyncio
import json
import sys
from pathlib import Path

try:
    import edge_tts
except ModuleNotFoundError as exc:
    raise SystemExit(
        "edge-tts is required for Ari video voice generation. Install it with: py -m pip install edge-tts"
    ) from exc


def clamp_rate(value: int) -> int:
    return max(-100, min(100, value))


def format_rate(value: int) -> str:
    clamped = clamp_rate(value)
    if clamped >= 0:
        return f"+{clamped}%"
    return f"{clamped}%"


def format_signed_percent(value: int) -> str:
    if value >= 0:
        return f"+{value}%"
    return f"{value}%"


async def generate_segment(output_dir: Path, voice_name: str, segment: dict) -> None:
    segment_id = str(segment.get("segmentId", "")).strip()
    if not segment_id:
      raise ValueError("Voiceover segment is missing segmentId.")

    text = str(segment.get("text", "")).strip()
    if not text:
      raise ValueError(f"Voiceover segment '{segment_id}' is missing text.")

    rate = int(segment.get("rate", 0))
    volume = float(segment.get("volume", 1))
    volume_percent = max(0, min(100, round(volume * 100)))
    output_path = output_dir / f"{segment_id}.mp3"

    if output_path.exists():
        output_path.unlink()

    communicator = edge_tts.Communicate(
        text=text,
        voice=voice_name,
        rate=format_rate(rate),
        volume=format_signed_percent(volume_percent - 100),
    )
    await communicator.save(str(output_path))


async def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: py scripts/generate-ari-voiceover.py <manifest-path>")

    manifest_path = Path(sys.argv[1]).resolve()
    if not manifest_path.exists():
        raise SystemExit(f"Voiceover manifest was not found: {manifest_path}")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    voice_name = str(manifest.get("voiceName", "")).strip()
    if not voice_name:
        raise SystemExit("Voiceover manifest is missing voiceName.")

    segments = manifest.get("segments")
    if not isinstance(segments, list) or not segments:
        raise SystemExit("Voiceover manifest does not contain any segments.")

    output_dir = manifest_path.parent

    for pattern in ("*.mp3", "*.wav"):
        for existing_file in output_dir.glob(pattern):
            existing_file.unlink()

    for segment in segments:
        await generate_segment(output_dir, voice_name, segment)


if __name__ == "__main__":
    asyncio.run(main())
