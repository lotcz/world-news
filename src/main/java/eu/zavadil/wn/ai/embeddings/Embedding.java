package eu.zavadil.wn.ai.embeddings;

import java.util.ArrayList;

public class Embedding extends ArrayList<Float> {

	public static final int VECTOR_SIZE = 1536;

	public Embedding() {
		super(VECTOR_SIZE);
	}

	public Embedding(float[] array) {
		this();
		if (array.length != VECTOR_SIZE) {
			throw new RuntimeException(String.format("Provided array is of wrong length: %d! Expected: %d", array.length, VECTOR_SIZE));
		}
		for (int i = 0, max = array.length; i < max; i++) {
			this.add(array[i]);
		}
	}

	@Override
	public String toString() {
		return super.toString().replaceAll("\\s+", "");
	}

}
