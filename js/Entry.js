// Entry class

class Entry {
  constructor(title, content, dateTime, tags, image = null) {
    this.title = title;
    this.content = content;
    this.dateTime = dateTime;
    this.tags = tags;
    this.image = image;
  }
  
  // Get tags as an array
  getTagsArray() {
    if (!this.tags || this.tags.trim() === "") {
      return [];
    }
    return this.tags.split(",").map(tag => tag.trim());
  }
  
  // Check if entry has a specific tag
  hasTag(tag) {
    const tagLower = tag.toLowerCase();
    return this.getTagsArray().some(t => t.toLowerCase() === tagLower);
  }
  
  // Convert to storage format (for localStorage)
  toJSON() {
    return {
      title: this.title,
      content: this.content,
      dateTime: this.dateTime,
      tags: this.tags,
      image: this.image
    };
  }
  
  // Create from storage format
  static fromJSON(data) {
    return new Entry(
      data.title,
      data.content,
      data.dateTime,
      data.tags,
      data.image
    );
  }
}