package eu.zavadil.wn.ai.embeddings.data;

import java.util.ArrayList;
import java.util.List;

public class Embedding extends ArrayList<Float> {

	public static final int VECTOR_SIZE = 1536;

	public Embedding() {
		super(VECTOR_SIZE);
	}

	public Embedding(List<Float> list) {
		this();

		if (list.size() != VECTOR_SIZE) {
			throw new RuntimeException(
				String.format(
					"Provided list is of wrong length: %d! Expected: %d",
					list.size(),
					VECTOR_SIZE
				)
			);
		}

		this.addAll(list);
	}

	public Embedding(float[] array) {
		this();

		if (array.length != VECTOR_SIZE) {
			throw new RuntimeException(
				String.format(
					"Provided array is of wrong length: %d! Expected: %d",
					array.length,
					VECTOR_SIZE
				)
			);
		}

		for (float v : array) {
			this.add(v);
		}
	}

	@Override
	public String toString() {
		return super.toString().replaceAll("\\s+", "");
	}

}
